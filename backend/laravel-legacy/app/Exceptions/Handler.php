<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        if ($request->expectsJson()) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    private function handleApiException(Request $request, Throwable $e)
    {
        if ($e instanceof ValidationException) {
            return response()->json([
                'code' => 422,
                'message' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        }

        if ($e instanceof NotFoundHttpException) {
            return response()->json([
                'code' => 404,
                'message' => 'Resource not found'
            ], 404);
        }

        if ($e instanceof MethodNotAllowedHttpException) {
            return response()->json([
                'code' => 405,
                'message' => 'Method not allowed'
            ], 405);
        }

        $code = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

        return response()->json([
            'code' => $code,
            'message' => $e->getMessage() ?: 'Internal server error',
            'details' => config('app.debug') ? $e->getTrace() : null
        ], $code);
    }
}
