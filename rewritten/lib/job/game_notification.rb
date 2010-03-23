class Job::GameNotification < Struct.new(:game)
  def perform
    GameNotifier.send("deliver_#{game.class.name.demodulize.underscore}", game)
  end
end