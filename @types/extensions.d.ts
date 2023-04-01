declare type ToCamelCase<S extends string> =
	S extends `${infer T}_${infer U}`?
		`${T}${Capitalize<ToCamelCase<U>>}` : S;

export declare type ToCamel<Type> =
	Type extends object?
		{
			[Key in keyof Type as ToCamelCase<Key & string>]: ToCamel<Type[Key]>
		} : Type;