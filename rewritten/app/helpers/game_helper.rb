module GameHelper
  def tile_path(location)
    File.join("", "images", "board", "temporary", "tile#{colour_to_number(location)}#{edging(location)}.png")
  end
  def colour_to_number(location)
    if (location.open? and location.hoshi?) then
      "0c"
    else
      location.open? ? ("0") : (location.black? ? ("1") : ("2"))
    end
  end
  def edging(location)
    "#{location.top_edge? ? ("n") : (location.bottom_edge? ? ("s") : (""))}#{location.left_edge? ? ("w") : (location.right_edge? ? ("e") : (""))}"
  end
end