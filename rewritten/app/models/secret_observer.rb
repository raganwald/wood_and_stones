class SecretObserver < ActiveRecord::Observer
  def after_create(secret)
    Delayed::Job.enqueue(Job::SecretNotification.new(secret))
  end
end