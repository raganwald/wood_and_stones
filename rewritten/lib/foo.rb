class Foo
  def bar(arr)
    (__126409352573366__ = arr
    if __126409352573366__.kind_of?(Enumerable) then
      RewriteRails::ExtensionMethods::Enumerable.sum(__126409352573366__)
    else
      __126409352573366__.sum
    end)
  end
end