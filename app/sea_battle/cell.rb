class Cell
  attr_accessor :status

  def initialize(status: 0)
    @status = status
  end

  def free?
    status.zero?
  end
end
