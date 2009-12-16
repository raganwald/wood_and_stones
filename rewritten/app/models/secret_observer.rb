class SecretObserver < ActiveRecord::Observer
  def after_create(secret)
    Notification::ShareSecret.create!(:user => (secret.user), :subject => (secret))
  end
end