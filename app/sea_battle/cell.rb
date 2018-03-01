class Cell
  attr_reader :x_axis, :y_axis, :status

  def initialize(x_axis:, y_axis:, status: 'free')
    @x_axis, @y_axis, @status = x_axis, y_axis, status
  end

  def free?
    status == 'free'
  end
end
