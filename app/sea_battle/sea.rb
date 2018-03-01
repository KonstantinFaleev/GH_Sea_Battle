class Sea
  include Enumerable

  def field_empty
    Array.new(10).map! { Array.new(10).map! { |elem| elem = ''} }
  end

  def set_ship
    @player_field = Sea.new.field_empty
    ship_four
    ship_three
    ship_two
    ship_one
    @player_field
  end

  def ship_four
    if rand(0..1) == 1
      y_axis = rand(0..5)
      x_axis = rand(0..9)
      border = y_axis + 4
      while y_axis < border
        @player_field[y_axis + 1][x_axis] = 'x'
        y_axis += 1
      end
    else
      x_axis = rand(0..9)
      y_axis = rand(0..5)
      border = y_axis + 4
      while y_axis < border
        @player_field[x_axis][y_axis + 1] = 'x'
        y_axis += 1
      end
    end
  end

  def ship_three
    ship_count = 0
    until ship_count == 2
      position = rand(0..1)
      if position == 1
        x_axis = rand(0..9)
        y_axis = rand(0..6)
        border = y_axis + 3
        if @player_field[y_axis][x_axis].empty?
          if free_cell(x_axis, y_axis, position, 3)
            while y_axis < border
              @player_field[y_axis][x_axis] = 'x'
              y_axis += 1
            end
            ship_count += 1
          end
        end
      else
        x_axis = rand(0..6)
        y_axis = rand(0..9)
        border = x_axis + 3
        if @player_field[x_axis][y_axis].empty?
          if free_cell(x_axis, y_axis, position, 3)
            while x_axis < border
              @player_field[y_axis][x_axis] = 'x'
              x_axis += 1
            end
            ship_count += 1
          end
        end
      end
    end
  end


  def ship_two
    ship_count = 0
    until ship_count == 3
      position = rand(0..1)
      if position == 1
        x_axis = rand(0..9)
        y_axis = rand(0..7)
        border = y_axis + 2
        if @player_field[y_axis][x_axis].empty?
          if free_cell(x_axis, y_axis, position, 2)
            while y_axis < border
              @player_field[y_axis][x_axis] = 'x'
              y_axis += 1
            end
            ship_count += 1
          end
        end
      else
        x_axis = rand(0..7)
        y_axis = rand(0..9)
        border = x_axis + 2
        if @player_field[x_axis][y_axis].empty?
          if free_cell(x_axis, y_axis, position, 2)
            while x_axis < border
              @player_field[y_axis][x_axis] = 'x'
              x_axis += 1
            end
            ship_count += 1
          end
        end
      end
    end
  end

  def ship_one
    ship_count = 0
    until ship_count == 4
      x_axis = rand(0..9)
      y_axis = rand(0..8)
      border = y_axis + 1
      if @player_field[y_axis][x_axis].empty?
        if free_cell(x_axis, y_axis, 0, 1)
          while y_axis < border
            @player_field[y_axis][x_axis] = 'x'
            y_axis += 1
          end
          ship_count += 1
        end
      end
    end
  end

  private
  def free_cell(y_axis, x_axis, position, size)
    if position == 1
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
          if @player_field[i][j] == ''
            @player_field[i][j] = ''
          else
            return false
          end
        end
      end
    else
      from_x = x_axis - 1
      to_x = if x_axis < 9
               x_axis + 1
             else
               x_axis
             end
      from_y = y_axis - 1
      to_y = y_axis + size
      for j in from_x..to_x do
        for i in from_y..to_y do
          if @player_field[j][i] == ''
            @player_field[j][i] = ''
          else
            return false
          end
        end
      end
    end
  end
end