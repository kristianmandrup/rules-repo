// Generated by LiveScript 1.2.0
(function(){
  var requires, User, Book, Matcher, createMatcher, expect;
  requires = require('../../../../../requires');
  requires.test('test_setup');
  User = requires.fix('user');
  Book = requires.fix('book');
  Matcher = requires.rule('container').matcher.RuleMatcher;
  createMatcher = function(container, act, ar, debug){
    debug == null && (debug = true);
    return new Matcher(container, act, ar, debug);
  };
  expect = require('chai').expect;
  describe('RuleMatcher', function(){
    var subjects, ar, containers, matcher;
    subjects = {};
    ar = {};
    containers = {};
    subjects.book = {
      name: 'a nice journey',
      _class: 'Book'
    };
    subjects.movie = {
      name: 'The Apollo moonlanding scam!',
      _class: 'Movie',
      type: 'documentary'
    };
    ar.book = {
      user: 'kris',
      action: 'edit',
      subject: subjects.book
    };
    containers.managedBook = {
      can: {
        manage: ['book', 'blog'],
        write: ['journal', 'article'],
        edit: ['movie']
      }
    };
    containers.unmanagedBook = {
      can: {
        edit: ['book', 'blog'],
        create: ['article'],
        write: ['journal', 'article']
      }
    };
    describe('create', function(){
      context('invalid', function(){
        return specify('throws', function(){
          return expect(function(){
            return createMatcher({}, 'can', void 8);
          }).to['throw'];
        });
      });
      return context('valid', function(){
        specify('ok', function(){
          return expect(function(){
            return createMatcher(containers.managedBook, 'can', {});
          }).to.not['throw'];
        });
        return specify('act is set', function(){
          return createMatcher(containers.managedBook, 'can', {}).act.should.eql('can');
        });
      });
    });
    context('valid matcher', function(){
      beforeEach(function(){
        return matcher = createMatcher(containers.managedBook, 'can', ar.book);
      });
      describe('manage-actions', function(){
        return specify('has CED actions', function(){
          return matcher.manageActions.should.eql(['create', 'edit', 'delete']);
        });
      });
      describe('match-subject', function(){
        return specify('edit does not match', function(){
          return matcher.matchSubject().should.eql(false);
        });
      });
      describe('subject-matcher', function(){
        return specify('is void', function(){
          return expect(matcher.subjectMatcher()).to.not.eql(void 8);
        });
      });
      describe('action-subjects', function(){
        return specify('is void', function(){
          return expect(matcher.actionSubjects()).to.not.eql(void 8);
        });
      });
      return describe('act-container', function(){
        return specify('has subjects', function(){
          return matcher.actContainer().should.eql({
            manage: ['book', 'blog'],
            write: ['journal', 'article'],
            edit: ['movie']
          });
        });
      });
    });
    context('unmanaged book', function(){
      beforeEach(function(){
        return matcher = createMatcher(containers.unmanagedBook, 'can', ar.book);
      });
      describe('managed-subject-matcher', function(){
        return specify('is void', function(){
          return expect(matcher.managedSubjectMatcher()).to.not.eql(void 8);
        });
      });
      describe('managed-subject-match', function(){
        return specify('matches', function(){
          return matcher.managedSubjectMatch().should.eql(false);
        });
      });
      describe('action-subjects', function(){
        return specify('matches', function(){
          return expect(matcher.actionSubjects()).to.eql(['book', 'blog']);
        });
      });
      describe('match-subject', function(){
        return specify('matches', function(){
          return matcher.matchSubject().should.eql(true);
        });
      });
      describe('subject-matcher', function(){
        return specify('matches', function(){
          return expect(matcher.subjectMatcher()).to.not.eql(void 8);
        });
      });
      return describe('match', function(){
        return specify('matches', function(){
          return matcher.match().should.eql(true);
        });
      });
    });
    return context('managed book', function(){
      beforeEach(function(){
        return matcher = createMatcher(containers.managedBook, 'can', ar.book);
      });
      describe('managed-subject-matcher', function(){
        return specify('is void', function(){
          return expect(matcher.managedSubjectMatcher()).to.not.eql(void 8);
        });
      });
      describe('action', function(){
        return specify('is edit, not manage', function(){
          return matcher.action.should.eql('edit');
        });
      });
      describe('managed-subject-match', function(){
        return specify('matches', function(){
          return matcher.managedSubjectMatch().should.eql(true);
        });
      });
      return describe('match', function(){
        return specify('matches', function(){
          return matcher.match().should.eql(false);
        });
      });
    });
  });
}).call(this);
