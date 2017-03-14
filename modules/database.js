// connection -> db
const sequelize = require ('sequelize'),
      pg = require('pg'),
      express = require ('express');

// const db = new sequelize( 'blogapp', 'nyle', 'nyle', {
//   host: 'localhost',
//   dialect: 'postgres'
// } );

const db = new sequelize( 'blogapp', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres'
} )



// Schemas

//  User schema
const User = db.define( 'user', {
	username: sequelize.STRING,
	email: sequelize.STRING,
	password: sequelize.STRING
} );

// Post schema
const Post = db.define( 'post', {
	title: sequelize.STRING,
	body: sequelize.STRING
} );

// Comment schema
const Comment = db.define( 'comment', {
	body: sequelize.STRING
} );

// Linking models together
Post.belongsTo( User );
User.hasMany( Post );
Comment.belongsTo( User);
Comment.belongsTo( Post);
User.hasMany ( Comment);
Post.hasMany( Comment);


module.exports = {
  User: User,
  Post: Post,
  Comment: Comment
};
