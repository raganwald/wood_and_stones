class Action::Pass < Action::Gameplay
  before_validation_on_create { |pass| pass.after = pass.before }
end