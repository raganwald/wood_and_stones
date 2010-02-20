class Action::Pass < Action::Gameplay
  before_validation_on_create { self.after = self.before }
end