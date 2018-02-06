class Ship2Controller < ApplicationController

  def create

  end

  def show
    @player_one = Array.new(10).map! { Array.new(10) }

    @player_one.each_index do |x_axis|
      @player_one[x_axis].each_index do |y_axis|
        @player_one[x_axis][y_axis] = ''
      end
    end

    if rand(0..1) == 1
      y_axis = rand(0..5)
      x_axis = rand(0..9)
      border = y_axis + 4
      while y_axis < border
        @player_one[y_axis + 1][x_axis] = '4'
        y_axis += 1
      end
    else
      x_axis = rand(0..9)
      y_axis = rand(0..5)
      border = y_axis + 4
      while y_axis < border
        @player_one[x_axis][y_axis + 1] = '4'
        y_axis += 1
      end
    end
2.times do
    if rand(0..1) == 1 # three ship
      y_axis = rand(0..6)
      x_axis = rand(0..9)
      border = y_axis + 3
      while y_axis < border
        @player_one[y_axis + 1][x_axis] = '3'
        y_axis += 1
      end
    else
      x_axis = rand(0..9)
      y_axis = rand(0..6)
      border = y_axis + 3
      while y_axis < border
        @player_one[x_axis][y_axis + 1] = '3'
        y_axis += 1
      end
    end
end

    3.times do
      if rand(0..1) == 1 # two ship
        y_axis = rand(0..7)
        x_axis = rand(0..9)
        border = y_axis + 2
        while y_axis < border
          @player_one[y_axis + 1][x_axis] = '2'
          y_axis += 1
        end
      else
        x_axis = rand(0..9)
        y_axis = rand(0..7)
        border = y_axis + 2
        while y_axis < border
          @player_one[x_axis][y_axis + 1] = '2'
          y_axis += 1
        end
      end

    end

    4.times do
      if rand(0..1) == 1 # three ship
        y_axis = rand(0..8)
        x_axis = rand(0..9)
        border = y_axis + 1
        while y_axis < border
          @player_one[y_axis + 1][x_axis] = '1'
          y_axis += 1
        end
      else
        x_axis = rand(0..9)
        y_axis = rand(0..8)
        border = y_axis + 1
        while y_axis < border
          @player_one[x_axis][y_axis + 1] = '1'
          y_axis += 1
        end
      end
    end


    render 'show'
  end

  def set_ship
  end
  def free_cell (axis_x, axis_y)
    if (0..9).include?(axis_x) and (0..9).include?(axis_y)

    end
      end
end
