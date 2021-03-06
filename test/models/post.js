'use strict';

const { Bone } = require('../..');

class Post extends Bone {
  static table = 'articles';

  static initialize() {
    this.hasOne('attachment', {
      foreignKey: 'postId'
    });
    this.hasMany('comments', {
      foreignKey: 'articleId'
    });
    this.hasMany('tagMaps', {
      foreignKey: 'targetId',
      where: { targetType: 0 }
    });
    this.hasMany('topics', { through: 'tagMaps',  where: { type: 1 }, className: 'Tag' });
    this.hasMany('tags', { through: 'tagMaps', where: { type: 0 } });

    this.attribute('extra', { type: JSON });
  }

  get slug() {
    return this.attribute('title')
      .replace(/^([A-Z])/, (m, chr) => chr.toLowerCase())
      .replace(/ ([A-Z])/g, (m, chr) => `-${chr.toLowerCase()}`);
  }

  // custom getters in class syntax should not make attributes not enumerable
  get title() {
    return this.attribute('title').replace(/^([a-z])/, function(m, chr) {
      return chr.toUpperCase();
    });
  }
}

Object.defineProperty(Post.prototype, 'slug', {
  ...Object.getOwnPropertyDescriptor(Post.prototype, 'slug'),
  enumerable: true,
});

module.exports = Post;
