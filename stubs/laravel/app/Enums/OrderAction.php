<?php

namespace App\Enums;

enum OrderAction: string
{
    case Confirm = 'confirm';
    case Pack = 'pack';
    case MarkOutForDelivery = 'mark_out_for_delivery';
    case Deliver = 'deliver';
    case Cancel = 'cancel';
    case Return = 'return';
    case AutoAssigned = 'auto_assigned';
}
