class CreateFeedbacks < ActiveRecord::Migration
  def change
    create_table :feedbacks do |t|
      t.integer :round_id
      t.text :feedback
      t.integer :user_id

      t.timestamps null: false
    end
  end
end
