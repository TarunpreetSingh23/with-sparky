<Link href="/user" className="relative">
          <IoBagHandleOutline className="text-2xl text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>