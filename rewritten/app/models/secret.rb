class Secret < ActiveRecord::Base
  belongs_to(:user)
  belongs_to(:target, :polymorphic => (true))
  validates_uniqueness_of(:secret)
  validates_presence_of(:secret)
  before_validation_on_create(:assign_secret)
  named_scope(:for_user, lambda { |user| { :conditions => ({ :user_id => (user.id) }) } })
  def assign_secret
    self.secret = (__126084893414693__ = (1000000 + rand(9999999))
    if __126084893414693__.kind_of?(Fixnum) then
      RewriteRails::ExtensionMethods::Fixnum.shortened(__126084893414693__)
    else
      __126084893414693__.shortened
    end)
    true
  end
end