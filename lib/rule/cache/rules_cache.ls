FingerPrinter = require 'fingerprint' .FingerPrinter
Debugger      = require '../../util'  .Debugger

# Acts as cache for Permit Registry
module.exports = class RulesCache implements Debugger
  (@object = {}, @options = {}) ->
    @clear-cache!
    @fp-class = FingerPrinter || @options.fingerprinter
    @registry = @options.registry

  init: ->
    @observe @registry if @registry
    @fingerprint!

  # should be cleared whenever a new permit is added and activated.
  clear-cache: (act) ->
    if act
      @cache[act] = {}
    else
      @cache = {}
    @

  # accessors to cache!
  get: (name) ->
    @cache[name]

  set: (name, value) ->
    @cache[name] = value
    @

  # can be used where multiple caches are needed...
  # overrides self with value :)
  # TODO: should use this pattern much more
  fingerprint: ->
    @fingerprint = @no-print! or @fingerprinter!.fingerprint!

  no-print: ->
    'x' if Object.keys @object .length == 0

  fingerprinter: ->
    new @fp-class @object

  # add observers to cache
  observe: (...targets) ->
    for target in targets
      target.add-observer @ if typeof! target?add-observer is 'Function'

  # by default clears cache on any change
  notify: (sender, event) ->
    @clear-cache!
