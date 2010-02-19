module RewriteRails
  
  module ExtensionMethods
    
    class String
      
      def self.to_location(str)
        str.scan(/[abcdefghijklmnopqrst]/i).map { |l| Board::LETTERS.index(l.upcase) }.select { |i| i && i >= 0 && i < 18  }
      end
      
    end
    
    class Array
      
      def self.to_position(arr)
        "#{Board::LETTERS[arr[0]]}#{Board::LETTERS[arr[1]]}".downcase
      end
      
    end
    
  end
  
end