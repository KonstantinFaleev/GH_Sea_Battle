class Ai
  attr_reader :my_ships, :my_shots

  def initialize(battlefield)
    @battlefield = battlefield
    @my_ships = generate_my_ships
    @my_shots
  end

  def attack
    []
  end

  def last_attack_result(status)

  end

  def attacked(coors)

  end

  private

  def generate_my_ships

  end
end
