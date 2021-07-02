exports.seed = function(knex){
  return knex('users').insert([
    {
      user_id: 1,
      username: 'user',
      password: 'pass',
      first_name: 'User',
      last_name: 'Test',
      email: 'something@gmail.com',
      admin: false
    }
  ])
}
