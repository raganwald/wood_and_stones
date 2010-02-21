module RewriteRails
  
  module ExtensionMethods
    
    class String
      
      def self.to_location(str)
        Board.position_to_location(str)
      end
      
    end
    
    class Array
      
      def self.to_position(arr)
        Board.location_to_position(arr)
      end
      
    end
    
  end
  
end