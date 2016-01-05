'use strict';

import _ from 'lodash';


class Tree {
  constructor(tree, options){
    //Immutable purpose
    tree = _.clone(tree, true);
    if(!_.isPlainObject(tree)){
      throw Error(`tree should be plain object`); 
    }
    this.options = _.assign({
      childrenPropName: 'children',
      identification: 'name',
    }, options);
    
    this.childrenPropName = this.options.childrenPropName;
    this.identification = this.options.identification;
    
    if(_.isPlainObject(tree) && _.isArray(tree.children)){
      this.tree = this._n2f(tree);
    }else {
      this.tree = tree;
    }
  }
  replaceTree(tree, options){
    this.constructor(tree, options?this.options:options);
  }
  //nested tree to flag tree
  _n2f(node){
    if(!node) return {};
    if(_.isArray(node[this.childrenPropName])){
      let childNodes = node[this.childrenPropName].reduce((memo, node) => {
        return _.assign(memo, this._n2f(node))
      }, {});

      node[this.childrenPropName] = node[this.childrenPropName].map(node => node[this.identification]);
      return _.assign({},{
        [node[this.identification]]: node
      }, childNodes);
    }
    
    return _.assign({},{
      [node[this.identification]]: node
    })
  }
  //flag tree to nested tree
  _f2n(tree, node){
    if(!node) return {};
    
    //init to [] for none children node
    if(!node[this.childrenPropName] || !_.isArray(node[this.childrenPropName])){
      return _.assign({}, node, {
        children: []
      })
    }

    let children = node[this.childrenPropName].map(id => {
      return this._f2n(tree, tree[id]);
    })
    
    return _.assign({}, node, {
      children
    })
  }
  getTree(nested){
    if(nested) return this._f2n(this.tree, this.tree['root']);
    return this.tree;
  }
  _travesalTree(tree, node, processor, order = 'preOrder'){
    if(!node) return;

    if(order === 'preOrder'){
      let flag = processor(tree, node);
      if(_.isBoolean(flag) && !flag) return;
    }
    if(node[this.childrenPropName]&& node[this.childrenPropName] instanceof Array){
      node[this.childrenPropName].forEach(id => {
        this._travesalTree(tree, tree[id], processor, order)
      })
    }
    if(order === 'inOrder') processor(tree, node);
  }
  traversal(processor, order){
    this._travesalTree(this.tree, this.tree['root'], processor, order);
  }
  removeNode(id){
    this.traversal((tree, node) => {
      if(!_.isPlainObject(node)) return;
      if(_.isArray(node[this.childrenPropName])){
        var index = node[this.childrenPropName].indexOf(id);
        if(index>=0){
          node[this.childrenPropName].splice(index, 1);
          delete tree[id]
        }
      }
    })
  }
  updateNode(obj){
    if(!obj[this.identification]){
      console.warn(`identification ${this.identification} is not found in updateNode param`);
      return;
    }
    _.assign(this.tree[obj[this.identification]], obj);
  }
  insertBefore(obj, id){
    this.traversal((tree, node) => {
      if(!_.isPlainObject(node)) return;
      if(_.isArray(node[this.childrenPropName])){
        var index = node[this.childrenPropName].indexOf(id);
        if(index>=0){
          node[this.childrenPropName].splice(index, 0, obj[this.identification]);
          _.assign(tree, {
            [obj[this.identification]]: obj
          })
        }
      }
    })
  }
  insertAfter(obj, id){
    this.traversal((tree, node) => {
      if(!_.isPlainObject(node)) return;
      if(_.isArray(node[this.childrenPropName])){
        var index = node[this.childrenPropName].indexOf(id);
        if(index>=0){
          node[this.childrenPropName].splice(index+1, 0, obj[this.identification]);
          _.assign(tree, {
            [obj[this.identification]]: obj
          })
        }
      }
    })
  }
  /**
   * filter the tree, but not modify the tree data
   * @param  {Function} fn    
   * @param  {Boolean}  flag  return nested data
   * @return {[type]}        [description]
   */
  filter(fn, flag){
    flag = _.isBoolean(flag)?flag:false;
    //immutable purpose
    let cloneTree = _.clone(this.tree, true);
    this._travesalTree(cloneTree, cloneTree['root'], (tree, node) => {
      if(!_.isPlainObject(node)) return;
      if(_.isArray(node[this.childrenPropName])){
        node[this.childrenPropName] = node[this.childrenPropName].filter(id => {
          var flag = fn(tree, tree[id]);
          if(!flag) delete tree[id]
          return flag;
        });
      }
    }, 'inOrder');

    if(flag){
      return this._f2n(cloneTree, cloneTree['root']);
    }
    return cloneTree;
    // this.traversal((tree, node) => {
    //   if(!_.isPlainObject(node)) return;
    //   if(_.isArray(node[this.childrenPropName])){
    //     node[this.childrenPropName] = node[this.childrenPropName].filter(id => {
    //       var flag = fn(tree, tree[id]);
    //       if(!flag) delete tree[id]
    //       return flag;
    //     });
    //   }
    // }, 'inOrder')
  }
  keyWordFilter(key, keyWord, flag){
    flag = _.isBoolean(flag)?flag:false;
    if(!key || !keyWord){
      return this.getTree(flag);
    }
    return this.filter((tree, node) => {
      if(_.contains(node[key],keyWord) || (node[this.childrenPropName] && node[this.childrenPropName].length!=0)){
        return true;
      }
      return false;
    }, flag)
  }
}
module.exports = Tree;