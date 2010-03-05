module ApplicationHelper
  TILE_IMG_CLASS_MAP = { :topleft => ({ nil => "intersection top left empty", "black" => "intersection top left black", "white" => "intersection top left white" }), :top => ({ nil => "intersection top middle empty", "black" => "intersection top middle black", "white" => "intersection top middle white" }), :topright => ({ nil => "intersection top right empty", "black" => "intersection top right black", "white" => "intersection top right white" }), :left => ({ nil => "intersection left middle empty", "black" => "intersection left middle black", "white" => "intersection left middle white" }), :right => ({ nil => "intersection top middle right empty", "black" => "intersection top middle right black", "white" => "intersection top middle right white" }), :bottomleft => ({ nil => "intersection bottom left empty", "black" => "intersection bottom left black", "white" => "intersection bottom left white" }), :bottom => ({ nil => "intersection bottom middle empty", "black" => "intersection bottom middle black", "white" => "intersection bottom middle white" }), :bottomright => ({ nil => "intersection bottom right empty", "black" => "intersection bottom right black", "white" => "intersection bottom right white" }), :blank => ({ nil => "intersection interior empty", "black" => "intersection interior black", "white" => "intersection interior white" }), :star => ({ nil => "intersection star empty", "black" => "intersection star black", "white" => "intersection star white" }) }
  def tile_class_array(board, valids)
    valids.inject(board.map_array(TILE_IMG_CLASS_MAP)) do |classes, its|
      lambda do |cc|
        cc[its.location.first][its.location.last] += " valid"
        pos = (__126780562894215__ = its.location
        if __126780562894215__.kind_of?(Array) then
          RewriteRails::ExtensionMethods::Array.to_position(__126780562894215__)
        else
          __126780562894215__.to_position
        end)
        its.dead_stones.each do |dead_location|
          cc[dead_location.first][dead_location.last] += " atari killed_by_#{pos}"
        end
        cc
      end.call(classes)
    end
  end
end