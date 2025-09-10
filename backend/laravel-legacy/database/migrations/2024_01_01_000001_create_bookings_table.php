<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('customer_email');
            $table->enum('service_type', ['DROP_OFF', 'MOBILE', 'PICKUP_RETURN']);
            $table->string('vehicle_info');
            $table->string('address')->nullable();
            $table->timestamp('scheduled_at');
            $table->enum('status', ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
                  ->default('PENDING');
            $table->text('notes')->nullable();
            $table->decimal('price', 8, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['customer_email', 'status']);
            $table->index('scheduled_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('bookings');
    }
};
