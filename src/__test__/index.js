import Tree from '../index';
import should from 'should';
import _ from 'lodash';

describe('Tree class', function(){
  let flagTree, nestedTree;
  before(function(done){
    flagTree = {
      root: {
        name: 'root',
        children: ['1','2','3'],
      },
      '1': {
        name: '1',
        children: ['1.1','1.2']
      },
      '1.1': {
        name: '1.1',
        children: []
      },
      '1.2': {
        name: '1.2',
        children: []
      },
      '2': {
        name: '2',
        children: []
      },
      '3': {
        name: '3',
        children: []
      }
    };
    nestedTree = {
      name: 'root',
      children: [{
        name: '1',
        children: [{
          name: '1.1',
          children: [],
        },{
          name: '1.2',
          children: [],
        }]
      },{
        name: '2',
        children: []
      },{
        name: '3',
        children: []
      }]
    };
    done();
  });
  

  it('tree will transform flag and nested tree without modifiy', function(){
    let tree1 = new Tree(flagTree);
    should(tree1.getTree()).eql(flagTree)
    should(tree1.getTree(true)).eql(nestedTree);

    let tree2 = new Tree(nestedTree);
    should(tree2.getTree()).eql(flagTree);
    should(tree2.getTree(true)).eql(nestedTree);
  })

  it('removeNode', function(){
    let tree = new Tree(nestedTree);
    let expectTree = _.clone(nestedTree, true);
    //delete a child node
    expectTree.children[0].children.splice(0, 1);
    tree.removeNode('1.1');
    should(tree.getTree(true)).eql(expectTree);
  })

  it('insertBefore', function(){
    let tree = new Tree(nestedTree);
    let expectTree = _.clone(nestedTree, true);
    //insert a child node
    expectTree.children[0].children.splice(0, 0, {
      name: '1.0',
      children: []
    });
    tree.insertBefore({
      name: '1.0',
      children: []
    }, '1.1');
    console.log()
    should(tree.getTree(true)).eql(expectTree);
  })
  it('insertAfter', function(){
    let tree = new Tree(nestedTree);
    let expectTree = _.clone(nestedTree, true);
    //insert a child node
    expectTree.children[0].children.splice(2, 0, {
      name: '1.3',
      children: []
    });
    tree.insertAfter({
      name: '1.3',
      children: []
    }, '1.2');
    
    should(tree.getTree(true)).eql(expectTree);
  })

  it('keyWordFilter', function(){
    let tree = new Tree(nestedTree);
    let expectTree = _.clone(nestedTree, true);
    //filter child node
    expectTree.children[0].children.splice(1, 1);
    expectTree.children.splice(1, 2);
    tree.keyWordFilter('name', '1.1');

    should(tree.getTree(true)).eql(expectTree);
  })
  it('constructor error detect', function(){
    (function(){
      new Tree(233);
    }).should.throw(/plain object/)
  })
})