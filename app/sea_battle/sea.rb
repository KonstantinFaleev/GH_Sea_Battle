class Sea
  include Enumerable

  attr_reader :player_field, :field_size, :cells, :status

  def cell_status(x_axis, y_axis)
    @cells[x_axis][y_axis]
  end

  def free_cells
    cells.select(&:free?)
  end

  private

  def build_field(field_size)
    cells = Array.new(15) { Array.new(15) }
    1.upto(field_size) do |x_axis|
      1.upto(field_size) do |y_axis|
          cells[x_axis][y_axis] = Cell.new(x_axis: x_axis, y_axis: y_axis, status: 'free')
        end
    end
    cells
  end



  def create_ship(cells, direction)
    case cells
      when 4
        Ship.new(self, )
    end
  end

  def set_ship
    ship_four
    ship_three
    ship_two
    ship_one
  end

  def ship_four
    if rand(0..1) == 1
      y_axis = rand(0..5)
      x_axis = rand(0..9)
      border = y_axis + 4
      while y_axis < border
        player_field[y_axis + 1][x_axis] = 'x'
        y_axis += 1
      end
    else
      x_axis = rand(0..9)
      y_axis = rand(0..5)
      border = y_axis + 4
    end
    proveryaet_validnost_pervoi_tochki_nachala_korabla(y_axis, border, x_axis)
  end

  def proveryaet_validnost_pervoi_tochki_nachala_korabla(y_axis, border, x_axis)
    while y_axis < border
      player_field[x_axis][y_axis + 1] = 'x'
      y_axis += 1
    end
  end

  def ship_three
    position = rand(0..1)
    if position == 1
      x_axis = rand(0..9)
      y_axis = rand(0..6)
      border = y_axis + 3
      if player_field[y_axis][x_axis].empty?
        if free_cell(x_axis, y_axis, position, 3)
          while y_axis < border
            player_field[y_axis][x_axis] = 'x'
            y_axis += 1
          end
        end
      end
    else
      x_axis = rand(0..6)
      y_axis = rand(0..9)
      border = x_axis + 3
      if player_field[x_axis][y_axis].empty?
        if free_cell(x_axis, y_axis, position, 3)
          proveryaet_validnost_pervoi_tochki_nachala_korabla(y_axis, border, x_axis)
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
        if player_field[y_axis][x_axis].empty?
          if free_cell(x_axis, y_axis, position, 2)
            while y_axis < border
              player_field[y_axis][x_axis] = 'x'
              y_axis += 1
            end
            ship_count += 1
          end
        end
      else
        x_axis = rand(0..7)
        y_axis = rand(0..9)
        border = x_axis + 2
        if player_field[x_axis][y_axis].empty?
          if free_cell(x_axis, y_axis, position, 2)
            proveryaet_validnost_pervoi_tochki_nachala_korabla(y_axis, border, x_axis)
            ship_count += 1
          end
        end
      end
    end
  end

  def ship_one
    ship_count = 0
    until ship_count == 4

      random_cell = free_cells.sample
      border = y_axis + 1
      if player_field[y_axis][x_axis].empty?
        if free_cell(x_axis, y_axis, 0, 1)
          proveryaet_validnost_pervoi_tochki_nachala_korabla(y_axis, border, x_axis)
          ship_count += 1
        end
      end
    end
  end

  def free_cell(y_axis, x_axis, position, size)
    cell(x_axis, y_axis).free?
  end
end