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
    ship_four
    #ship_three
    #ship_two
    ship_one
    render 'show'
  end


  def ship_four
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
  end

  def ship_three
    if rand(0..1) == 1 # three ship
      y_axis = rand(0..6)
      x_axis = rand(0..9)
      border = y_axis + 3
      while y_axis < border
        if free_cell(x_axis, y_axis, 1, 3)
          @player_one[x_axis][y_axis + 1] = '3'
        else
          ship_three
        end
        y_axis += 1
      end
    else
      x_axis = rand(0..9)
      y_axis = rand(0..6)
      border = y_axis + 3
      while y_axis < border
        if free_cell(x_axis, y_axis, 1, 3)
        @player_one[x_axis + 1][y_axis] = '3'
        else
          ship_three
          y_axis += 1
        end
      end
    end
  end

  def ship_two
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
  end

  def ship_one
    ship_count = 0
    until ship_count == 4
      y_axis = rand(0..9)
      x_axis = rand(0..9)
      if free_cell(x_axis, y_axis, 1, 1)
        @player_one[x_axis][y_axis] = '1'
        ship_count += 1
      end
    end
  end

  private
  def free_cell(x_axis, y_axis, position, size)
    from_x = x_axis - 1
    to_x = if x_axis < 9
               x_axis + 1
            else
              x_axis
            end
    from_y = y_axis - 1
    to_y = y_axis + size

    (from_x..to_x).each do |x_coor|
      (from_y..to_y).each do |y_coor|
        if @player_one[x_coor][y_coor] == ''
          @player_one[x_coor][y_coor] = '.'
        else
          return false
        end
      end
    end
  end
end
