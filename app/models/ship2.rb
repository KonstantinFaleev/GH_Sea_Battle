class Ship2 < ApplicationController

  def new
    @player_two = Array.new(10).map! { Array.new(10) }
    @player_one = Array.new(10).map! { Array.new(10) }
  end

end
