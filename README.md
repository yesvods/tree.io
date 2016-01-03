# Tree.io

JS Tree shim for browser or nodejs enhance

[![build status](https://api.travis-ci.org/yesvods/tree.io.svg?branch=master)](https://travis-ci.org/yesvods/tree.io)
[![Coverage Status](https://coveralls.io/repos/yesvods/tree.io/badge.svg?branch=master&service=github)](https://coveralls.io/github/yesvods/tree.io?branch=master)

### Usage

#### Install
```
npm install tree.io --save
```

#### Import
```javascript
import Tree from 'tree.io';
let nestedTree = {
  name: 'root',
  children: [{
    name: 'childA',
    children: []
  },{
    name: 'childB',
    children: []
  }]
}
let tree = new Tree(nestedTree);
```

or init Tree with options:

```javascript
//Tree.io use "children" key to visit tree
//and "name" key to visit the tree node id
let tree = new Tree(nestedTree, {
  childrenPropName: 'children',
  identification: 'name'
})
```

may be it's a normalize tree:

```javascript
let flagTree = {
  root: {
    name: 'root',
    children: ['childA', 'childB']
  },
  childA: {
    name: 'childA',
    children: []
  },
  childB: {
    name: 'childB',
    children: []
  }
}

//Tree.io will detect nestedTree or flagTree
//by visiting the "children" key of it
let tree = new Tree(flagTree);
```

Attenation: There must be a 'root' tree node in the tree data passed to Tree.io.

### API

****
**Tree.io export serval simple methods just fit your need.**

#### #getTree

return tree object data

```javascript
//return normalize/flag tree by default
tree.getTree()

//return nested tree
tree.getTree(true)
```

#### #traversal(processor, order)

traversal the hold tree, order can be `preOrder`(default) and `inOrder`, visit [wiki](https://en.wikipedia.org/wiki/Tree_traversal) for more detail.

```
//may be you want to print the children of tree
tree.traversal((tree, node) => {
  console.log(node.name);
}, 'inOrder');
```

#### #removeNode(id)
remove a tree node by identification specified to construcotr,
you may have more operation of node by `#filter` method specified below

```
tree.removeNode('1.1');
```
#### #updateNode(obj)
update tree node, obj must contain the identification of the node being update.

```
tree.updateNode({
  name: '1.1',
  age: 23
})
```

#### #insertAfter(node, id)

insert a tree node after the node of spec `id`

```
tree.insertAfter({
  name: '1.3',
  children: []
}, '1.2');
```

#### #insertBefore(node, id)
the same as above;

#### #filter(fn)

like the Array.filter but with more power

#### #keyWordFilter(key, keyWord)

In common use implement of `#filter`, filter `keyWord` by spec `word` in tree node.

implement:

```javascript
keyWordFilter(key, keyWord){
  this.filter((tree, node) => {
    if(node[key] === keyWord || (node[this.childrenPropName] && node[this.childrenPropName].length!=0)){
    return true;
   }
    return false;
  })
}
```

usage:

```javascript
tree.keyWordFilter('name', 'childA');
```

### License

MIT





