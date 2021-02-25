const models = require('../../models');

const User = models.User;
const Favorite = models.Favorite;

console.log('CREATING NEW USER');

User.create({
  dropboxId: 'dropbox123',
  email: 'test@example.com',
  name: 'Test User',
  avatar: '/img/dropbox123.png',
})
  .then((newUser) => {
    console.log('USER CREATED');
    console.log(newUser.get());

    console.log('CREATING FAVORITES');

    Favorite.bulkCreate([
      { userId: newUser.id, name: 'One', path: '/favorite/one.ogg' },
      { userId: newUser.id, name: 'Two', path: '/favorite/two.ogg' },
      { userId: newUser.id, name: 'Three', path: '/favorite/three.ogg' },
    ])
      .then((newFavorites) => {
        console.log('FAVORITES CREATED');
        console.log(newFavorites);

        console.log('ASSOCIATIONS TEST');

        User.findOne({
          where: { email: 'test@example.com' },
          include: 'favorites'
        })
          .then((foundUser) => {
            console.log("user found: ", foundUser);
            console.log("favorites: ", foundUser.favorites);
          })
          .catch((err) => {
            console.log("Error creating favorites : ", err);
          });

      })
      .catch((err) => {
        console.log("Error creating favorites : ", err);
      });

  })
  .catch((err) => {
    console.log("Error creating user: ", err);
  });
