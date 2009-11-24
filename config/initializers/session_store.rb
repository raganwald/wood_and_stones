# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_go_session',
  :secret      => '64f3cb9fd5667b7e49ded7226a05cff3397cba37c59066dcf9dec998b3dc7c341380aa75e04dd4d928b3a1ab8959e02e60d1f4193735ae445a2753c5729d26b9'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
