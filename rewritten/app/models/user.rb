class User < ActiveRecord::Base
  validates_uniqueness_of(:email, :on => :create, :message => "must be unique")
  validates_each(:email) do |user, attr, email|
    TMail::Address.parse(email) rescue user.errors.add(:email, "Must be a valid email")
  end
  has_many(:notifications, :foreign_key => "recipient_id")
end