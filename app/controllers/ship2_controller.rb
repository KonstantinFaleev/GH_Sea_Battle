class Ship2Controller < ApplicationController

  def create

  end

  def show
    @player_one = Array.new(10).map! { Array.new(10) }

    @player_one.each_index do |i|
      @player_one[i].each_index do |j|
        @player_one[i][j] = [i, '_', j]
      end
    end

    if rand(0..1) == 1
      horizontal_axis = rand(0..6)
      vertical_axis = rand(0..9)
      border = horizontal_axis + 4
      while horizontal_axis < border
        @player_one[horizontal_axis + 1][vertical_axis] = 'Z'
        horizontal_axis += 1
      end
    else
      horizontal_axis = rand(0..9)
      vertical_axis = rand(0..6)
      border = vertical_axis + 4
      while vertical_axis < border
        @player_one[horizontal_axis][vertical_axis + 1] = 'Z'
        vertical_axis += 1
      end
    end
    render 'show'
  end

  def set_ship

  end
end
