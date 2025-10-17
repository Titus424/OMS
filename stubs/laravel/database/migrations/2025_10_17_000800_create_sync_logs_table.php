<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sync_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->cascadeOnDelete();
            $table->string('entity_type');
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->string('direction');
            $table->string('operation');
            $table->boolean('success')->default(false);
            $table->text('error')->nullable();
            $table->longText('payload')->nullable();
            $table->timestamps();
            $table->index(['shop_id', 'entity_type', 'direction', 'operation']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sync_logs');
    }
};
