# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  
  def self.full_tile_path(file_code)
    File.join('', 'images', 'board', 'temporary', "tile#{file_code}.png")
  end
  
  TILE_IMG_SRC_MAP = {
    :topleft => {
      nil     => full_tile_path('0nw'),
      'black' => full_tile_path('1nw'),
      'white' => full_tile_path('2nw')
    },
    :top => {
      nil     => full_tile_path('0n'),
      'black' => full_tile_path('1n'),
      'white' => full_tile_path('2n')
    },
    :topright => {
      nil     => full_tile_path('0ne'),
      'black' => full_tile_path('1ne'),
      'white' => full_tile_path('2ne')
    },
    :left => {
      nil     => full_tile_path('0w'),
      'black' => full_tile_path('1w'),
      'white' => full_tile_path('2w')
    },
    :right => {
      nil     => full_tile_path('0e'),
      'black' => full_tile_path('1e'),
      'white' => full_tile_path('2e')
    },
    :bottomleft => {
      nil     => full_tile_path('0sw'),
      'black' => full_tile_path('1sw'),
      'white' => full_tile_path('2sw')
    },
    :bottom => {
      nil     => full_tile_path('0s'),
      'black' => full_tile_path('1s'),
      'white' => full_tile_path('2s')
    },
    :bottomright => {
      nil     => full_tile_path('0se'),
      'black' => full_tile_path('1se'),
      'white' => full_tile_path('2se')
    },
    :blank => {
      nil     => full_tile_path('0'),
      'black' => full_tile_path('1'),
      'white' => full_tile_path('2')
    },
    :star => {
      nil     => full_tile_path('0c'),
      'black' => full_tile_path('1'),
      'white' => full_tile_path('2')
    }
  }
  
  TILE_IMG_CLASS_MAP = {
    :topleft => {
      nil     => 'top left empty',
      'black' => 'top left black occupied',
      'white' => 'top left white occupied'
    },
    :top => {
      nil     => 'top middle empty',
      'black' => 'top middle black occupied',
      'white' => 'top middle white occupied'
    },
    :topright => {
      nil     => 'top right empty',
      'black' => 'top right black occupied',
      'white' => 'top right white occupied'
    },
    :left => {
      nil     => 'left middle empty',
      'black' => 'left middle black occupied',
      'white' => 'left middle white occupied'
    },
    :right => {
      nil     => 'top middle right empty',
      'black' => 'top middle right black occupied',
      'white' => 'top middle right white occupied'
    },
    :bottomleft => {
      nil     => 'bottom left empty',
      'black' => 'bottom left black occupied',
      'white' => 'bottom left white occupied'
    },
    :bottom => {
      nil     => 'bottom middle empty',
      'black' => 'bottom middle black occupied',
      'white' => 'bottom middle white occupied'
    },
    :bottomright => {
      nil     => 'bottom right empty',
      'black' => 'bottom right black occupied',
      'white' => 'bottom right white occupied'
    },
    :blank => {
      nil     => 'interior empty',
      'black' => 'interior black occupied',
      'white' => 'interior white occupied'
    },
    :star => {
      nil     => 'star empty',
      'black' => 'star black occupied',
      'white' => 'star white occupied'
    }
  }
  
  def tile_img_src_array(board)
    board.map_array(TILE_IMG_SRC_MAP)
  end
  
  def tile_img_class_array(board)
    board.map_array(TILE_IMG_CLASS_MAP)
  end
  
end
