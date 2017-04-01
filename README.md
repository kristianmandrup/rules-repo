# Rules

[![Greenkeeper badge](https://badges.greenkeeper.io/kristianmandrup/rules-repo.svg)](https://greenkeeper.io/)

Rules is a stand-alone library for implementing authorization rules with any authorization library.
It was extracted from [permit-authorize](https://github.com/kristianmandrup/permit-authorize) and designed
for DI which allows for easier customization.

## Code

The code has been developed in [LiveScript](http://livescript.net/) which is very similar too [Coffee script](http://coffeescript.org/).
See [coffee-to-ls](http://livescript.net/#coffee-to-ls)

## Architecture

### Rule Repo

The `RuleRepo` wraps a `RuleContainer` which must expose the following API:

- `can`    : returns Object with rules (key, function)
- `cannot` : returns Object with rules (key, function)
- display  : returns String to display info about container
- register : registers arguments as rules
- clean    : removes all rules in container
- match    : matches act and access-request on rules in container

The `RuleRepo` wraps the built-in `RuleContainer` by default, by you can override this and provide your own in the
options has when you create your `RuleRepo`:

### Rule Container

The default Rule Container. Can be used as container for a `RuleRepo`.
API:

- can : rules container object
- cannot : rules container object
- `register(act, actions, subjects)` : registers rules
- `match(act, access-request)` : matches access via rules
- clean : clean rule container from all rules
- matcher : performs rule matching
- cleaner : performs rule cleaning
- registrator : performs rule registration

Default helpers are:
- RuleMatcher
- RuleCleaner
- RuleRegistrator

You can supply your own helper classes by injecting via constructor options hash:

`new RuleContainer({matcher: MyRulesMatcher});`

### Repo Guardian

The `RepoGuardian` can be used to guard a Rule Repository (ie. `RuleRepo`). You create a repo like this:

`guardian = new RepoGuardian(repo, access-request)`

You can then test access via access-request as follows:

`guardian.test-access('can')`
`guardian.test-access('cannot')`

Or via the allows API:

```js
guardian.allows()
guardian.disallows()
```

`allows` will by default first test if the access-request *can* get access, then it will also test the reverse,
if there are any rules which specifically prohibit access via *cannot*.
You can disable the reverse *cannot* check by passing `false` as an argumnt.

`guardian.allows(false)`

Note: should it take an options hash instead, such as `disallows: false` ?

### Rule Registrator

The `RuleRegistrator` is responsible for registering rules in a `RuleContainer`

`new RuleRegistrator(ruleContainer)`

`register(act, actions, subjects)`

The `RuleRegistrator` currently uses a `RuleAdder` to do the "heavy lifting"

`new RuleAdder act-container, subjects, debugging`

### Rule Adder

`new RuleAdder(act-container, subjects, debugging)`

The `act-container` is simply an Object for either the `can` or `cannot` rules which will be populated by the rules added.

```js
# adds rules for an action
add(action) ->
  ...
  @action-subjects action, @subjects
  @container[action] = @action-subjects!
  @add-manage action
```

The rules added are simply key/value pairs in the act-container Object:

```
can:
  publish: ['Book', Article']
  edit: ['Paper']
  ...
```

The `RuleAdder` uses a `RuleExtractor` to get a list of unique action subjects

```js
action-subjects: (action) ->
  _action-subjects ||= extractor(action).extract!

extractor: (action) ->
  new RuleExtractor container, action, @subjects
```

### Rule Extractor

The rule extractor is able to generate a unique list of action subjects where
each unique subject is normalized (ie. camelized like a class name)

`new RuleExtractor(container, action, subjects)`

```js
extract: ->
  @debug "register action subjects", @action-subjects!, @unique-subjects!
  unique normalized(@action-subjects!).concat @unique-subjects!
```

### Rule Matcher

`new RuleMatcher(ruleContainer, act, access-request)`

`match` - matches all rules given the `act` and `access-request`

Proceeds as follows:

```js
match ->
  ...
  return @managed-subject-match! if @action is 'manage'
  ...
  @match-subject!

managed-subject-match: ->
  @managed-subject-matcher!.match @clazz

match-subject: ->
  @subject-matcher!.match @clazz
```

Where the matchers are `ManagedSubjectMatcher` and `SubjectMatcher`.
Currently these Matcher classes cannot be injected.

### Managed Subject Matcher

Tries to determine if there is a `manage` key on the act-container which contains the subject (ie. class name)

```js
 (@act-container) # constructor

  match: (subject) ->
    return false unless subject
    @is-managed subject

  # see if there is a 'manage' key that contains the subject
  is-managed: (subject) ->
    ...
```

### Subject Matcher

Tries to determine if there is an array intersection between the subjects
being tested and the subjects of the action rule.

```js
# action rules
can:
  publish: ['Book', Article']
```

Test:

```js
new SubjectMatcher(['Book', Article'])
subjectMatcher.match(['book, 'Paper'])
```

The `match` function uses both wildcard intersection and subject intersection.
A wildcard can be `'Any'` or `'*'`.

```js
  match: (ar-subjects) ->
    ar-subjects = @_class-normalize ar-subjects
    @intersects(@wild-cards) or @intersects ar-subjects
```

### Rule Cleaner

`new RuleCleaner(ruleContainer)`

`clean-all` clean all act-containers (both for `can` and `cannot`)
`clean(act)` clean rules for a single act-container, where `act` can be either `can` or `cannot`

### Rules Cache

The `RulesCache` can be used to cache rules which apply for an individual user or similar use case.

`new RulesCache(obj, options)`

It has its own fingerprint, so you can have one cache per user or whatever.
This could even (potentially) be used for local "long lived" session storage...

`create-cache(current-user).fingerprint()`

Then you can access cache entries via `get(key)` and `set(key, value)`. A common use case
is to use access request fingerprints as keys and then store the authorization result for that key
 for quick retrieval.

## Contribution

Please help improve this project, suggest improvements, add better tests etc. ;)

## Licence

MIT License
Copyright 2014-2015 Kristian Mandrup

See LICENSE file