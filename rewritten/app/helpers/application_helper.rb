module ApplicationHelper
  TILE_IMG_CLASS_MAP = { :topleft => ({ nil => "top left empty", "black" => "top left black", "white" => "top left white" }), :top => ({ nil => "top middle empty", "black" => "top middle black", "white" => "top middle white" }), :topright => ({ nil => "top right empty", "black" => "top right black", "white" => "top right white" }), :left => ({ nil => "left middle empty", "black" => "left middle black", "white" => "left middle white" }), :right => ({ nil => "top middle right empty", "black" => "top middle right black", "white" => "top middle right white" }), :bottomleft => ({ nil => "bottom left empty", "black" => "bottom left black", "white" => "bottom left white" }), :bottom => ({ nil => "bottom middle empty", "black" => "bottom middle black", "white" => "bottom middle white" }), :bottomright => ({ nil => "bottom right empty", "black" => "bottom right black", "white" => "bottom right white" }), :blank => ({ nil => "interior empty", "black" => "interior black", "white" => "interior white" }), :star => ({ nil => "star empty", "black" => "star black", "white" => "star white" }) }
  def tile_class_array(board, valids)
    valids.inject(board.map_array(TILE_IMG_CLASS_MAP)) do |classes, its|
      lambda do |cc|
        cc[its.location.first][its.location.last] += " valid"
        pos = (__126706631481013__ = its.location
        if __126706631481013__.kind_of?(Array) then
          RewriteRails::ExtensionMethods::Array.to_position(__126706631481013__)
        else
          __126706631481013__.to_position
        end)
        its.dead_stones.each do |dead_location|
          cc[dead_location.first][dead_location.last] += " atari killed_by_#{pos}"
        end
        cc
      end.call(classes)
    end
  end
end