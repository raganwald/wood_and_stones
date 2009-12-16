class Notification::ShareSecret < Notification::Base
  validates_each(:subject) do |record, attr, subject|
    unless subject.kind_of?(Secret) then
      record.errors.add(attr, "#{subject} is not a secret")
    end
  end
  validates_each(:user) do |record, attr, user|
    if (user and (record.subject and (not (user == record.subject.try(:user))))) then
      record.errors.add(attr, "#{user} is not party to the secret")
    end
  end
end