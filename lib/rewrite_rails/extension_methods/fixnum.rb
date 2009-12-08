class RewriteRails::ExtensionMethods::Fixnum
  
  URL_CHARS = ('0'..'9').to_a + %w(b c d f g h j k l m n p q r s t v w x y z) + %w(B C D F G H J K L M N P Q R S T V W X Y Z - _)
  URL_BASE = URL_CHARS.size

  def self.shortened(num)
    localCount = num
    result = ''
    while localCount != 0
      remainder = localCount % URL_BASE
      localCount = (localCount - remainder) / URL_BASE # localCount = (localCount – remainder) / URL_BASE
      result = URL_CHARS[remainder] + result
    end
    result
  end
  
end