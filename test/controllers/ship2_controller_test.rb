require 'test_helper'

class Ship2ControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get ship2_create_url
    assert_response :success
  end

end
