class Job::SecretNotification < Struct.new(:secret)
  def perform
    SecretMailer.send("deliver_#{secret.target.class.name.demodulize.underscore}", secret)
  end
end