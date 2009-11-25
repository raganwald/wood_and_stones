class Board < ActiveRecord::Base
  validates_inclusion_of(:dimension, :in => ([9, 11, 13, 15, 17, 19, 21, 23, 25]))
  def self.initial(options = {  })
    self.new(options)
  end
  LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  def valid_position?(str)
    if position = parse_position(str) then
      ((position.h >= 0) and ((position.h < dimension) and ((position.v >= 0) and (position.v < dimension))))
    end
  end
  private
  def parse_position(str)
    if md = /^([:alpha:])([123456789]\d*)$/i.match(position) then
      letter = md[1].upcase
      horizontal_offset = LETTERS.index(letter)
      vertical_offset = (md[2].to_i - 1)
      ObjectStruct.new(:h => (horizontal_offset), :v => (vertical_offset))
    end
  end
end