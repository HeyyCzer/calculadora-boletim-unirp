"use client";

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Calculator() {
	const [result, setResult] = useState<{
		grade: number,
		success: boolean,
		name: string
	} | null>(null);
	const [homeworks, setHomeworks] = useState<string[]>([]);

	const updateHomeworks = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const index = Number(e.target.id.split('-')[1]) - 1;

		const newHomeworks = [...homeworks];
		newHomeworks[index] = value;
		setHomeworks(newHomeworks);
	}

	const calculateBasedOnTests = (intermediateGrade: number, semiAnnualGrade: number) => {
		const testsGrade = ((intermediateGrade + semiAnnualGrade) / 2) * 0.7;

		const workGrade = 7 - testsGrade;
		const workGradePercentage = workGrade / 0.3;

		setResult({
			grade: workGradePercentage,
			success: workGradePercentage <= 0,
			name: "trabalho"
		});
	}

	const calculateBasedOnWorksAndOneTest = (worksGrade: number, testGrade: number, testName: string) => {
		const testsGrade = (testGrade / 2) * 0.7;
		const workGrade = worksGrade * 0.3;
		const finalGrade = testsGrade + workGrade;

		const remainingGrade = 7 - finalGrade;
		const remainingGradePercentage = remainingGrade / (0.7 / 2);

		setResult({
			grade: remainingGradePercentage,
			success: remainingGradePercentage <= 0,
			name: testName
		});
	}

	const onSubmit = () => {
		const intermediate = (document.getElementById("intermediate") as HTMLInputElement).value;
		const semiAnnual = (document.getElementById("semi-annual") as HTMLInputElement).value;

		let workAvg = 0;
		const filteredWorks = homeworks.filter(work => work !== "");
		if (filteredWorks.length > 0) {
			const workSum = filteredWorks.reduce((acc, curr) => (acc) + Number(curr), 0);
			workAvg = workSum / filteredWorks.length;

			if (intermediate) {
				return calculateBasedOnWorksAndOneTest(workAvg, Number(intermediate), "prova semestral");
			} else if (semiAnnual) {
				return calculateBasedOnWorksAndOneTest(workAvg, Number(semiAnnual), "prova intermediária");
			}
		}
		calculateBasedOnTests(Number(intermediate), Number(semiAnnual));
	}

	return (
		<>
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Calculadora de Média</CardTitle>
					<CardDescription>Insira suas notas para descobrir quanto de nota você precisa.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid w-full items-center gap-4">
						{/* Trabalhos */}
						{
							([...homeworks, 0]).map((_, index) => (
								<div key={index} className="flex flex-col space-y-1.5">
									<Label htmlFor={`work-${index + 1}`}>Trabalho {index + 1}</Label>
									<Input id={`work-${index + 1}`} placeholder="Insira sua nota" pattern="^\d*(\.\d{0,2})?$" onChange={updateHomeworks} />
								</div>
							))
						}

						{/* Provas */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white dark:bg-slate-950 px-2 text-muted-foreground">
									Provas
								</span>
							</div>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="intermediate">Prova Intermediária</Label>
							<Input id="intermediate" placeholder="Insira sua nota" pattern="^\d*(\.\d{0,2})?$" />
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="semi-annual">Prova Semestral</Label>
							<Input id="semi-annual" placeholder="Insira sua nota" pattern="^\d*(\.\d{0,2})?$" />
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-end">
					<Button onClick={onSubmit}>Calcular</Button>
				</CardFooter>
			</Card>
			
			<AlertDialog open={!!result} onOpenChange={(open) => {
				if (!open) setResult(null);
			}}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{
								result?.success
									? "Você já passou!"
									: (result?.grade || 0) > 10
										? "Impossível passar!"
										: "Ainda dá pra recuperar!"
							}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{
								result?.success
									? "Parabéns! Você já atingiu a nota mínima!"
									: `Você precisa de ${result?.grade.toFixed(2)} na ${result?.name} para passar.${(result?.grade || 0) > 10 ? " Infelizmente não há mais a possibilidade de recuperar!" : ""}`
							}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction>Fechar</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}