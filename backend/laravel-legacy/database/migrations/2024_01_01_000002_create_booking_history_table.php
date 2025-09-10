<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('booking_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->string('status');
            $table->text('notes')->nullable();
            $table->timestamp('timestamp')->useCurrent();
            $table->timestamps();

            $table->index(['booking_id', 'timestamp']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('booking_history');
    }
};
