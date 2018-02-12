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
    ship_three
    ship_two
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
    ship_count = 0
    until ship_count == 2
      if rand(1..1) == 1 # three ship
        x_axis = rand(0..9)
        y_axis = rand(0..6)
        border = y_axis + 3
        if @player_one[y_axis][x_axis].empty?
          if free_cell(x_axis, y_axis, 1, 3)
              while y_axis < border
                puts('while1')
                @player_one[y_axis][x_axis] = '3'
                y_axis += 1
              end
              ship_count += 1

          end
        end
      end
      puts(ship_count)
    end
    end


  def ship_two
    ship_count = 0
    until ship_count == 3
      if rand(1..1) == 1 # three ship
        x_axis = rand(0..9)
        y_axis = rand(0..7)
        border = y_axis + 2
        if @player_one[y_axis][x_axis].empty?
          if free_cell(x_axis, y_axis, 1, 2)
            while y_axis < border
              puts('while_2')
              @player_one[y_axis][x_axis] = '2'
              y_axis += 1
            end
            ship_count += 1

          end
        end
      end
      puts(ship_count)
    end
  end

  def ship_one
    ship_count = 0
    until ship_count == 4
      if rand(1..1) == 1 # three ship
        x_axis = rand(0..9)
        y_axis = rand(0..8)
        border = y_axis + 1
        if @player_one[y_axis][x_axis].empty?
          if free_cell(x_axis, y_axis, 1, 1)
            while y_axis < border
              puts('while_one')
              @player_one[y_axis][x_axis] = '1'
              y_axis += 1
            end
            ship_count += 1

          end
        end
      end
      puts(ship_count)
    end
  end

  private
  def free_cell(y_axis, x_axis, position, size)
    from_y = y_axis - 1
    to_y = if y_axis < 9
             y_axis + 1
           else
             y_axis
           end
    from_x = x_axis - 1
    to_x = x_axis + size

    for j in from_y..to_y do
      for i in from_x..to_x do
        if @player_one[i][j] == ''
          @player_one[i][j] = ''
        else
          return false
        end

      end
    end
  end
end