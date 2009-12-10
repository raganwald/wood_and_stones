class Secret < ActiveRecord::Base
  belongs_to(:user)
  belongs_to(:target, :polymorphic => (true))
  validates_uniqueness_of(:secret)
  validates_presence_of(:secret)
  before_validation_on_create(:assign_secret)
  def assign_secret
    self.secret = (__126041209540380__ = (1000000 + rand(9999999))
    if __126041209540380__.kind_of?(Fixnum) then
      RewriteRails::ExtensionMethods::Fixnum.shortened(__126041209540380__)
    else
      __126041209540380__.shortened
    end)
    true
  end
end