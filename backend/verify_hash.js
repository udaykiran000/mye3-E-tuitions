const bcrypt = require('bcryptjs');

const hash = '$2b$10$swkDHSdgvpGIQgXV1slng.5UD3eudyDkZ8b6YYD35BujNYeR1ZbEG';
const password = '123123';

bcrypt.compare(password, hash).then(res => {
  console.log('Match:', res);
  if (!res) {
    // Also try checking if the hash itself is valid for some other common variants if needed
    console.log('Hash length:', hash.length);
  }
});
