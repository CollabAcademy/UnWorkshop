class CreateFeedbackRatings < ActiveRecord::Migration
  def change
    create_table :feedback_ratings do |t|
      t.integer :feedback_id
      t.integer :user_id
      t.integer :rating

      t.timestamps null: false
    end
  end
end
