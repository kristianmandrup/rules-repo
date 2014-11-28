util      = require '../../util'
Debugger  = util.Debugger

RuleMatcher       = require './matcher/rule_matcher'
RuleCleaner       = require './rule_cleaner'
RuleRegistrator   = require './rule_registrator'

module.exports = class RuleContainer implements Debugger
  (@options = {}, @debugging = false) ->
    @configure!
    @

  _type: 'RuleContainer'

  can: {}
  cannot: {}

  configure: ->
    @matcher-class     = @options.matcher     || RuleMatcher
    @registrator-class = @options.registrator || RuleRegistrator
    @cleaner-class     = @options.cleaner     || RuleCleaner

  register: (act, actions, subjects) ->
    @debug 'container register', act, actions, subjects
    @registrator!.register act, actions, subjects

  match: (act, access-request) ->
    @matcher act, access-request .match!

  clean: (act) ->
    @cleaner!.clean act
    @

  matcher: (act, access-request) ->
    new @matcher-class @, act, access-request

  cleaner: ->
    @_cleaner ||= new @cleaner-class @

  registrator: ->
    @_registrator ||= new @registrator-class @, @debugging

  # Displayer class?
  display: ->
    console.log "can-rules:", @can
    console.log "cannot-rules:", @cannot
    @
