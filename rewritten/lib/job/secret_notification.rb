class Job::SecretNotification < Struct.new(:secret)
  def perform
    puts("#{secret.secret} should be emailed to #{secret.user.email} here")
  end
end