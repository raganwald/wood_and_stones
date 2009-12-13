class Colour
  BLACK, WHITE = ["black", "white"]
  def self.black
    @black ||= self.new(BLACK)
  end
  def self.white
    @white ||= self.new(WHITE)
  end
  def initialize(colour)
    colour &&= colour.to_string.downcase
    unless [BLACK, WHITE, nil].include?(colour) then
      raise("#{colour} is not a colour!")
    end
    @colour = colour
  end
  def black?
    (@colour == BLACK)
  end
  def white?
    (@colour == WHITE)
  end
  def blank?
    @colour.nil?
  end
  def to_s
    @colour.to_s
  end
end